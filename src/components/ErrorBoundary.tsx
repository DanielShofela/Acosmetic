import React from 'react';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Une erreur inattendue est survenue.";
      
      try {
        const parsedError = JSON.parse(this.state.error.message);
        if (parsedError.error && parsedError.error.includes("Missing or insufficient permissions")) {
          errorMessage = "Vous n'avez pas les permissions nécessaires pour effectuer cette action.";
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-off-white p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
            <h2 className="text-2xl font-display font-bold text-brand-green mb-4">Oups !</h2>
            <p className="text-slate-600 mb-6">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-brand-green text-white px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-all"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
