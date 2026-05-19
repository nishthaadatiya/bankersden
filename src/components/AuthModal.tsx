'use client';

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { X, ShieldCheck, Zap, Lock } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  title = "Sign in to Continue", 
  subtitle = "Please sign in with your Google account to proceed with your application." 
}) => {
  const { login } = useAuth();

  const [isLoading, setIsLoading] = React.useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Gradient */}
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <Lock className="w-8 h-8" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            {title}
          </h2>
          <p className="text-gray-600 text-center mb-8">
            {subtitle}
          </p>
          
          <div className="space-y-4">
            <div className="flex justify-center">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600 font-medium">Verifying account...</span>
                </div>
              ) : (
                <GoogleLogin 
                  onSuccess={async (credentialResponse) => {
                    if (credentialResponse.credential) {
                      setIsLoading(true);
                      try {
                        const success = await login(credentialResponse.credential);
                        if (success) {
                          if (onSuccess) onSuccess();
                          onClose();
                        }
                      } finally {
                        setIsLoading(false);
                      }
                    }
                  }}
                  onError={() => console.log('Login Failed')}
                  width="100%"
                  theme="filled_blue"
                  shape="pill"
                  text="continue_with"
                />
              )}
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Secure SSL</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Instant Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 text-center">
          <p className="text-xs text-gray-400">
            By continuing, you agree to BankersDen's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};
