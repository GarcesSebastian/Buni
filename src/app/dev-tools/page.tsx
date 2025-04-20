"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { useNotification } from "@/hooks/client/useNotification"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Progress } from "@/components/ui/Progress"
import { Badge } from "@/components/ui/Badge"
import { Play, Pause, RefreshCw, Settings2, X, Trash2 } from "lucide-react"
import { DevToolsService, TestConfig } from "@/lib/DevTools"
import { useUserData } from "@/hooks/auth/useUserData"
import { useWebSocket } from "@/hooks/server/useWebSocket"

interface TestFormConfig {
    iterations: number
    delay: number
    interval: number
    dataType: string
    eventId?: number
    dataPerInterval?: number
}

const typesData = [
    {
        label: "Asistencias",
        value: "assists"
    },
    {
        label: "Inscripciones",
        value: "inscriptions"
    }
]

export default function DevToolsPage() {
    const { user } = useUserData()
    const { showNotification } = useNotification()
    const { sendMessage } = useWebSocket()
    const [tests, setTests] = useState<TestConfig[]>([])
    const [config, setConfig] = useState<TestFormConfig>({
        iterations: 1,
        delay: 0,
        interval: 1000,
        dataType: "assists",
        dataPerInterval: 1
    })

    useEffect(() => {
        const devTools = DevToolsService.getInstance(sendMessage)
        const interval = setInterval(() => {
            setTests(devTools.getTests())
        }, 100)
        return () => clearInterval(interval)
    }, [sendMessage])

    const handleConfigChange = (field: keyof TestFormConfig, value: string | number) => {
        setConfig(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const validateConfig = () => {
        if ((config.dataType === 'assists' || config.dataType === 'inscriptions')) {
            if (!config.eventId) {
                showNotification({
                    title: "Error de validación",
                    message: "Se requiere el ID del evento para generar asistencias o inscripciones",
                    type: "error"
                })
                return false
            }
            if (!config.dataPerInterval || config.dataPerInterval < 1) {
                showNotification({
                    title: "Error de validación",
                    message: "Debes especificar al menos 1 dato por intervalo",
                    type: "error"
                })
                return false
            }
        }
        return true
    }

    const createTest = () => {
        if (!validateConfig()) return

        const devTools = DevToolsService.getInstance(sendMessage)
        const testId = devTools.createTest(config)
        
        showNotification({
            title: "Prueba creada",
            message: "La prueba ha sido creada correctamente",
            type: "success"
        })

        return testId
    }

    const startTest = async (testId: string) => {
        const devTools = DevToolsService.getInstance(sendMessage)
        devTools.runTest(testId, user)
    }

    const handlePause = (testId: string) => {
        const devTools = DevToolsService.getInstance()
        devTools.pauseTest(testId)
    }

    const handleResume = (testId: string) => {
        const devTools = DevToolsService.getInstance()
        devTools.resumeTest(testId)
    }

    const handleCancel = (testId: string) => {
        const devTools = DevToolsService.getInstance()
        devTools.cancelTest(testId)
    }

    const handleDelete = (testId: string) => {
        const devTools = DevToolsService.getInstance()
        devTools.deleteTest(testId)
    }

    return (
        <div className="h-full overflow-y-auto mx-auto w-full max-w-4xl p-4 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Herramientas de Desarrollo</h1>
                <Badge variant="outline" className="text-sm">
                    {process.env.NODE_ENV === "development" ? "Modo Desarrollo" : "Modo Producción"}
                </Badge>
            </div>
            
            <Tabs defaultValue="generator" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="generator">
                        <Settings2 className="w-4 h-4 mr-2" />
                        Generador de Datos
                    </TabsTrigger>
                    <TabsTrigger value="monitor">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Monitor de Pruebas
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="generator">
                    <Card>
                        <CardHeader className="flex flex-col">
                            <CardTitle>Generador de Datos de Prueba</CardTitle>
                            <CardDescription>
                                Configura y ejecuta pruebas automatizadas para generar datos de prueba
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="iterations">Número de Iteraciones</Label>
                                        <Input
                                            id="iterations"
                                            type="number"
                                            min="1"
                                            value={config.iterations}
                                            onChange={(e) => handleConfigChange("iterations", parseInt(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="delay">Delay entre Iteraciones (segundos)</Label>
                                        <Input
                                            id="delay"
                                            type="number"
                                            min="0"
                                            value={config.delay}
                                            onChange={(e) => handleConfigChange("delay", parseInt(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="interval">Intervalo entre Datos (ms)</Label>
                                        <Input
                                            id="interval"
                                            type="number"
                                            min="100"
                                            value={config.interval}
                                            onChange={(e) => handleConfigChange("interval", parseInt(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="dataType">Tipo de Datos</Label>
                                        <Select
                                            value={config.dataType}
                                            onValueChange={(value) => {
                                                handleConfigChange("dataType", value)
                                                if (value !== 'assists' && value !== 'inscriptions') {
                                                    setConfig(prev => ({ ...prev, eventId: undefined }))
                                                }
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {typesData.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {(config.dataType === 'assists' || config.dataType === 'inscriptions') && (
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="eventId">ID del Evento</Label>
                                                <Input
                                                    id="eventId"
                                                    type="number"
                                                    min="1"
                                                    value={config.eventId || ''}
                                                    onChange={(e) => handleConfigChange("eventId", parseInt(e.target.value))}
                                                    placeholder="Ingresa el ID del evento"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="dataPerInterval">Datos por Intervalo</Label>
                                                <Input
                                                    id="dataPerInterval"
                                                    type="number"
                                                    min="1"
                                                    value={config.dataPerInterval}
                                                    onChange={(e) => handleConfigChange("dataPerInterval", parseInt(e.target.value))}
                                                    placeholder="Cantidad de datos a generar por intervalo"
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={() => {
                                    const testId = createTest()
                                    if (testId) {
                                        startTest(testId)
                                    }
                                }}>
                                    <Play className="w-4 h-4 mr-2" />
                                    Crear y Ejecutar Prueba
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="monitor">
                    <Card>
                        <CardHeader className="flex flex-col">
                            <CardTitle>Monitor de Pruebas</CardTitle>
                            <CardDescription>
                                Visualiza el estado y resultados de las pruebas en tiempo real
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {tests.map((test) => (
                                    <Card key={test.id}>
                                        <CardHeader className="pb-2">
                                            <div className="flex gap-4 items-center justify-between">
                                                <CardTitle className="text-sm font-medium">
                                                    Prueba {test.id}
                                                </CardTitle>
                                                <div className="flex gap-2">
                                                    {test.status === 'running' && (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handlePause(test.id)}
                                                            >
                                                                <Pause className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleCancel(test.id)}
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                    {test.status === 'paused' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleResume(test.id)}
                                                            >
                                                                <Play className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleCancel(test.id)}
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                    {(test.status === 'idle' || test.status === 'cancelled') && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(test.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>Tipo: {test.dataType}</span>
                                                    <Badge variant={test.status === 'running' ? "default" : "outline"}>
                                                        {test.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>Iteración: {test.currentIteration} / {test.iterations}</span>
                                                    <span>Progreso: {Math.round(test.progress)}%</span>
                                                </div>
                                                <Progress value={test.progress} className="h-2" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
} 