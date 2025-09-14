from abc import ABC, abstractmethod

class BaseHandler(ABC):
    """Abstract base class for all Kind handlers."""
    def __init__(self, doc, output_dir):
        self.doc = doc
        self.output_dir = output_dir
        self.spec = doc.get('spec', {})
        self.metadata = doc.get('metadata', {})

    @abstractmethod
    def generate(self):
        """Generates the asset for the given resource."""
        pass
