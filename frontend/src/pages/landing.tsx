import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useUser } from "@stackframe/react";

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
    <div className="">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Instantly Generate Modern Backend Boilerplates
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Say goodbye to tedious setup and focus on building your application.
        </p>
        <Button size="lg" onClick={handleGetStarted}>Get Started</Button>
      </section>

      <Separator className="my-12" />

      <section className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Flexible Stack Selection</CardTitle>
            </CardHeader>
            <CardContent>
              Choose your preferred technologies to build your backend.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Intuitive Data Modeling</CardTitle>
            </CardHeader>
            <CardContent>
              Easily define your data models and API endpoints.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Comprehensive Output</CardTitle>
            </CardHeader>
            <CardContent>
              Receive production-ready code with validation, Dockerfiles, and deployment configurations.
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-12" />

      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to build faster?</h2>
        <Button size="lg" onClick={handleGetStarted}>Start Generating</Button>
      </section>
    </div>
  );
};

export default LandingPage;
