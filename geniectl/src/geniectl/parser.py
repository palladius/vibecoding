import yaml

def parse_manifest(filename):
    """Parses a multi-document YAML manifest file."""
    try:
        with open(filename, 'r') as f:
            documents = list(yaml.safe_load_all(f))
            return [doc for doc in documents if doc] # Filter out empty documents
    except yaml.YAMLError as e:
        # In the future, we can raise a custom exception here
        raise e
