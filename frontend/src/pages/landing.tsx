import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@stackframe/react";
import { Button } from "@/components/ui/button"; // Assuming Button component exists

const LandingPage: React.FC = () => {
  const user = useUser()
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if(user){
      navigate('/projects');
    }else {
      navigate('/handler/sign')
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4 py-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
        Create Stunning Product Demos. Effortlessly.
      </h1>
      <p className="text-lg md:text-xl max-w-2xl mb-10 opacity-90">
        Turn your product features into interactive stories. Engage users, accelerate sales, and simplify onboarding with powerful, visual demos.
      </p>
      <Button
        onClick={handleGetStarted}
        className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        Get Started for Free
      </Button>

      <div className="mt-16 text-sm opacity-80">
        <p>Inspired by platforms like Arcade.</p>
      </div>
    </div>
  );
};

export default LandingPage;
