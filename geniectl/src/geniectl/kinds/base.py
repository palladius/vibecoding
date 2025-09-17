from abc import ABC, abstractmethod
import click
import subprocess
import os
import json
import re

class BaseHandler(ABC):
    """Abstract base class for all Kind handlers."""
    def __init__(self, doc, output_dir, all_resources, config):
        self.doc = doc
        self.output_dir = output_dir
        self.all_resources = all_resources
        self.config = config
        self.spec = doc.get('spec', {})
        self.metadata = doc.get('metadata', {})

    def generate(self):
        """Dispatches to the correct engine implementation."""
        engine = self.spec.get('engine', 'Native')

        click.echo(f"-> Generating for '{self.metadata.get('name')}' using [{engine}] engine...")

        if engine == 'Native':
            return self._generate_native()
        elif engine == 'GeminiCLI':
            return self._generate_geminicli()
        elif engine == 'MCP':
            return self._generate_mcp()
        else:
            click.echo(f"   - Error: Engine '{engine}' is not supported.", err=True)

    @abstractmethod
    def _generate_native(self):
        """Generates the asset using the Native (Python) engine."""
        pass

    @abstractmethod
    def _generate_geminicli(self):
        """Generates the asset using the GeminiCLI engine."""
        pass

    @abstractmethod
    def _generate_mcp(self):
        """Generates the asset using the MCP engine."""
        pass

    def _post_generate_check(self):
        """Optional post-generation checks for the created asset."""
        pass

    def _handle_eval(self):
        """Handles the post-generation evaluation of the created asset."""
        if os.environ.get('GENIECTL_EVAL', 'true').lower() == 'false':
            return

        eval_config = self.spec.get('eval')
        if not eval_config:
            return

        click.echo(f"-> Evaluating '{self.metadata.get('name')}'...")

        # Deterministic checks
        deterministic_checks = eval_config.get('deterministic', {})
        if deterministic_checks:
            if not self._run_deterministic_checks(deterministic_checks):
                self._run_actions(False) # Evaluation failed
                return

        # Prompt-based evaluation
        prompt = eval_config.get('prompt')
        if prompt:
            if not self._run_prompt_evaluation(prompt):
                solution = eval_config.get('solution', 'delete') # Default to delete
                self._run_solution(solution)
                return

        # If we are here, all evaluations passed, so we can run the notify action
        # self._run_actions(True) # All evaluations passed

    def _run_deterministic_checks(self, checks):
        """Runs all defined deterministic checks."""
        for check_type, check_value in checks.items():
            if check_type == 'file_exists':
                if not self._check_file_exists(check_value):
                    return False
            elif check_type == 'file_type_match':
                if not self._check_file_type_match(check_value):
                    return False
            # Add other deterministic checks here in the future
        return True

    def _check_file_exists(self, file_path_pattern):
        """Checks if a file or files matching a pattern exist."""
        # This is a simple check. We might need to support glob patterns later.
        full_path = os.path.join(self.output_dir, file_path_pattern)
        if not os.path.exists(full_path):
            click.echo(f"   - ❌ FAIL: File '{file_path_pattern}' does not exist.", err=True)
            return False

        click.echo(f"   - ✅ PASS: File '{file_path_pattern}' exists.")
        return True

    def _check_file_type_match(self, pattern):
        """Checks if the file type of the output file(s) matches the given regex pattern."""
        output_path = self.spec.get('output', {}).get('path')
        if not output_path:
            return True # Should not happen if there is an eval

        replicas = self.spec.get('replicas', 1)
        if replicas > 1:
            p = os.path.join(self.output_dir, output_path)
            base_name, extension = os.path.splitext(p)
            output_paths = [f"{base_name}_{i}{extension}" for i in range(1, replicas + 1)]
        else:
            output_paths = [os.path.join(self.output_dir, output_path)]

        for file_path in output_paths:
            if not os.path.exists(file_path):
                click.echo(f"   - ❌ FAIL: File '{file_path}' does not exist for file type check.", err=True)
                return False

            try:
                result = subprocess.run(["file", file_path], check=True, capture_output=True, text=True)
                file_type = result.stdout.strip()
                if not re.search(pattern, file_type):
                    click.echo(f"   - ❌ FAIL: File '{file_path}' type '{file_type}' does not match pattern '{pattern}'.", err=True)
                    return False
            except FileNotFoundError:
                click.echo("   - 🚧 Warning: 'file' command not found. Skipping file type verification.", err=True)
                return True # Or should this be False? For now, let's not fail the build
            except subprocess.CalledProcessError as e:
                click.echo(f"   - 🚧 Warning: 'file' command failed during verification: {e}", err=True)
                return False

        click.echo(f"   - ✅ PASS: File type match for pattern '{pattern}'.")
        return True

    def _run_prompt_evaluation(self, prompt):
        """Runs the LLM-based evaluation using a prompt."""
        click.echo("   - Evaluating with LLM prompt...")

        # Prepare the prompt by substituting any variables
        # For now, let's assume the prompt might contain placeholders for output files
        # This is a simplified substitution, we might need a more robust mechanism
        output_path = self.spec.get('output', {}).get('path')
        if output_path:
            full_output_path = os.path.join(self.output_dir, output_path)
            if os.path.exists(full_output_path):
                with open(full_output_path, 'r') as f:
                    file_content = f.read()
                prompt = f"You are an evaluator. Your task is to evaluate the following file content and determine if it meets the requirements. Respond with a JSON object with a 'ret' key of 'success' or 'error' and an 'error_message' if it fails.\n\n{prompt}\n\n---\nFile content:\n{file_content}"
            else:
                click.echo(f"   - 🚧 Warning: Output file not found at {full_output_path}. Cannot include content in prompt.", err=True)

        command = self._gemini_command_from_prompt(prompt)
        command.extend(["--include-directories", self.output_dir])

        try:
            result = subprocess.run(command, check=True, capture_output=True, text=True)
            json_output = self._parse_json_from_gemini_output(result.stdout)

            if json_output and json_output.get('ret') == 'success':
                click.echo("   - ✅ PASS: LLM evaluation successful.")
                return True
            else:
                error_message = json_output.get('error_message', 'No error message provided.')
                click.echo(f"   - ❌ FAIL: LLM evaluation failed: {error_message}", err=True)
                return False

        except subprocess.CalledProcessError as e:
            click.echo(f"   - 🚧 Error during LLM evaluation: {e}", err=True)
            click.echo(f"     Stderr: {e.stderr}", err=True)
            return False

    def _run_solution(self, solution):
        """Runs the chosen solution for a failed evaluation."""
        output_path = self.spec.get('output', {}).get('path')
        if not output_path:
            return

        full_output_path = os.path.join(self.output_dir, output_path)
        if not os.path.exists(full_output_path):
            return

        if solution == 'delete':
            try:
                os.remove(full_output_path)
                click.echo(f"     - 🗑️ Deleted output file: {full_output_path}")
            except OSError as e:
                click.echo(f"     - 🚧 Error deleting file: {e}", err=True)
        elif solution == 'rename':
            wrong_file_path = f"{full_output_path}.wrong"
            try:
                os.rename(full_output_path, wrong_file_path)
                click.echo(f"     - ✍️ Renamed output file to: {wrong_file_path}")
            except OSError as e:
                click.echo(f"     - 🚧 Error renaming file: {e}", err=True)

    def _verify_file_type(self, file_path, keywords):
        """Uses the 'file' command to verify the type of a file."""
        if not os.path.exists(file_path):
            return

        try:
            result = subprocess.run(["file", file_path], check=True, capture_output=True, text=True)
            file_type = result.stdout.lower()

            if not any(keyword in file_type for keyword in keywords):
                click.echo(f"   - ❌ Error: Verification failed. Expected a file containing one of '{keywords}', but type was: {result.stdout.strip()}", err=True)
                try:
                    os.remove(file_path)
                    click.echo(f"     - Removed invalid file: {file_path}", err=True)
                except OSError as e:
                    click.echo(f"     - Failed to remove invalid file: {e}", err=True)
            else:
                click.echo(f"   - ✅ Verification successful: Output file type is correct.")

        except FileNotFoundError:
            click.echo("   - Warning: 'file' command not found. Skipping file type verification.", err=True)
        except subprocess.CalledProcessError as e:
            click.echo(f"   - Warning: 'file' command failed during verification: {e}", err=True)

    def _gemini_command_from_prompt(self, prompt):
        """Constructs the standard gemini command list from a prompt string."""
        return [
            "gemini", "-c",
            "--approval-mode", "auto_edit",
            "--session-summary", ".tmp.session-summary.json",
            "--prompt", prompt]

    def emoji(self):
        return "🤷‍♂️_NOT_IMPL_🤷‍♂️"

    def _parse_json_from_gemini_output(self, raw_output):
        """
        Parses a JSON object from the raw output of the Gemini CLI,
        stripping markdown fences if they exist.
        """
        json_string = raw_output
        if "```json" in json_string:
            json_string = json_string.split("```json")[1].split("```")[0]

        json_string = json_string.strip()

        try:
            return json.loads(json_string)
        except json.JSONDecodeError:
            click.echo("   - 🚧 Error: Failed to parse JSON output from Gemini CLI.", err=True)
            click.echo(f"     Raw output: {raw_output}", err=True)
            return None
