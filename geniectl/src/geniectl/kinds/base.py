from abc import ABC, abstractmethod

class BaseHandler(ABC):
    """Abstract base class for all Kind handlers."""
    def __init__(self, doc, output_dir, all_resources, config):
        self.doc = doc
        self.output_dir = output_dir
        self.all_resources = all_resources
        self.config = config
        self.spec = doc.get('spec', {})
        self.metadata = doc.get('metadata', {})

    @abstractmethod
    def generate(self):
        """Generates the asset for the given resource."""
        pass
