"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useUser } from "@stackframe/react"
import { useState } from "react"
import { ScriptCopyBtn } from "@/components/ui/script-copy-btn"

export default function JWT_Testing() {
  const user = useUser({ or: 'redirect' })
  const [access, setAccess] = useState<string | null>('')
  const [refresh, setRefresh] = useState<string | null>('')


  const generateJWT = async () => {
    const { accessToken, refreshToken } = await user.getAuthJson();
    setAccess(accessToken);
    setRefresh(refreshToken);
  }

  const customCommandMap = {
    accessToken: access!,
    refreshToken: refresh!,
  };
  
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-6">Auth Testing</h1>
          <p className="text-muted-foreground mb-8">
            A component that will generate Auth Tokens via StackSDK
          </p>

          <Card>
            <CardHeader>Click the button below to generate a JWT</CardHeader>
            <CardContent>
              <p>JWT is generated below</p>
              <ScriptCopyBtn
                showMultiplePackageOptions={true}
                codeLanguage="shell"
                lightTheme="nord"
                darkTheme="vitesse-dark"
                commandMap={customCommandMap}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={generateJWT}>Click Me</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
