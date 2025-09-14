"""
This module defines the GeminiCLI kind, which is used to interact with the Gemini CLI.
"""

import subprocess
import os
from .base import BaseHandler

class GeminiCLI(BaseHandler):
    """
    A kind that represents a call to the Gemini CLI.
    """    
    def generate(self):
        """
        Executes the Gemini CLI command.
        """
        prompt = self.spec.get('prompt')
        if not prompt:
            raise ValueError("Prompt is not defined in the spec")

        output_config = self.spec.get('output')
        if not output_config or 'path' not in output_config:
            raise ValueError("Output path is not defined in the spec")

        output_path = os.path.join(self.output_dir, output_config['path'])

        # Ensure the output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        full_prompt = f'{prompt}. The output file should be {output_path}'

        gemini_command = ["gemini", full_prompt]

        try:
            print(f"Executing command: {' '.join(gemini_command)}")
            subprocess.run(gemini_command, check=True)
            print(f"Successfully generated file: {output_path}")
        except FileNotFoundError:
            print("Error: 'gemini' command not found. Make sure the Gemini CLI is installed and in your PATH.")
            raise
        except subprocess.CalledProcessError as e:
            print(f"Error executing Gemini CLI: {e}")
            raise