import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Truck, ShoppingCart, CheckCircle } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-background to-muted/50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-balance leading-tight">
                Medicamentos con receta,
                <span className="text-primary"> entregados con seguridad</span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                Compara precios entre farmacias y elige la mejor opción para tus medicamentos con receta médica.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/medicamentos">
                <Button size="lg" className="text-lg px-8 py-6">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Ver Medicamentos
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-secondary" />
                <span className="text-sm text-muted-foreground">Farmacias certificadas</span>
              </div>
            </div>
          </div>

          {/* Right content - Features */}
          <div className="space-y-6">
            <div className="grid gap-4">
              <Card className="border-secondary/20 bg-secondary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary text-secondary-foreground p-3 rounded-lg">
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">Compara precios</h3>
                      <p className="text-muted-foreground">
                        Encuentra el mejor precio entre múltiples farmacias para tus medicamentos.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">Validación rápida</h3>
                      <p className="text-muted-foreground">
                        Las farmacias verifican tu receta y confirman disponibilidad.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-secondary/20 bg-secondary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary text-secondary-foreground p-3 rounded-lg">
                      <Truck className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">Entrega segura</h3>
                      <p className="text-muted-foreground">Recibe tus medicamentos con seguimiento en tiempo real.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
