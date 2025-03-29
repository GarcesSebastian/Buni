import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import Link from "next/link"

interface ErrorMessageProps {
  title: string
  description: string
  buttonText: string
  buttonHref: string
}

export function ErrorMessage({ title, description, buttonText, buttonHref }: ErrorMessageProps) {
  return (
    <div className="h-full flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col">
          <CardTitle className="text-2xl font-bold text-center text-red-600">{title}</CardTitle>
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Link href={buttonHref}>
              <Button className="bg-primary hover:bg-primary/90">
                {buttonText}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 