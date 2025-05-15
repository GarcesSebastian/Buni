import { generateSampleData } from "@/lib/DataTesting"
import { User } from "@/hooks/auth/useUserData"
import { Event } from "@/types/Events"
import { Form } from "@/types/Forms"
import { Socket } from "socket.io-client"

export interface TestConfig {
    id: string
    iterations: number
    delay: number
    interval: number
    dataType: string
    eventId?: string
    dataPerInterval?: number
    currentIteration: number
    status: 'idle' | 'running' | 'paused' | 'cancelled'
    progress: number
}

export class DevToolsService {
    private static instance: DevToolsService
    private socket: Socket | null = null
    private tests: Map<string, TestConfig> = new Map()
    private isCancelled: boolean = false

    private constructor() {}

    public static getInstance(socket?: Socket): DevToolsService {
        if (!DevToolsService.instance) {
            DevToolsService.instance = new DevToolsService()
        }
        if (socket) {
            DevToolsService.instance.socket = socket
        }
        return DevToolsService.instance
    }

    public createTest(config: Omit<TestConfig, 'id' | 'currentIteration' | 'status' | 'progress'>): string {
        const id = Math.random().toString(36).substring(2, 9)
        this.tests.set(id, {
            ...config,
            id,
            currentIteration: 0,
            status: 'idle',
            progress: 0
        })
        return id
    }

    public getTests(): TestConfig[] {
        return Array.from(this.tests.values())
    }

    public getTest(id: string): TestConfig | undefined {
        return this.tests.get(id)
    }

    public updateTest(id: string, updates: Partial<TestConfig>) {
        const test = this.tests.get(id)
        if (test) {
            this.tests.set(id, { ...test, ...updates })
        }
    }

    public cancelTest(id: string) {
        this.updateTest(id, { status: 'cancelled' })
    }

    public pauseTest(id: string) {
        this.updateTest(id, { status: 'paused' })
    }

    public resumeTest(id: string) {
        this.updateTest(id, { status: 'running' })
    }

    public deleteTest(id: string) {
        this.tests.delete(id)
    }

    public async runTest(id: string, user: User) {
        const test = this.tests.get(id)
        if (!test) return

        this.updateTest(id, { status: 'running' })

        try {
            for (let i = 0; i < test.iterations; i++) {
                if (test.status === 'cancelled') break

                while (test.status === 'paused') {
                    await new Promise(resolve => setTimeout(resolve, 100))
                }

                this.updateTest(id, { 
                    currentIteration: i + 1,
                    progress: ((i + 1) / test.iterations) * 100
                })

                if (test.dataType === 'assists') {
                    await this.generateAssists(test.interval, user, test.eventId, test.dataPerInterval)
                } else if (test.dataType === 'inscriptions') {
                    await this.generateInscriptions(test.interval, user, test.eventId, test.dataPerInterval)
                }
            }

            if (test.status !== 'cancelled') {
                this.updateTest(id, { status: 'idle' })
            }
        } catch (error) {
            console.error('Error en la prueba:', error)
            this.updateTest(id, { status: 'idle' })
        }
    }

    public cancel() {
        this.isCancelled = true
    }

    public reset() {
        this.isCancelled = false
    }

    public async generateUsers(interval: number) {
        await new Promise(resolve => setTimeout(resolve, interval))
    }

    public async generateEvents(interval: number) { 
        await new Promise(resolve => setTimeout(resolve, interval))
    }

    public async generateForms(interval: number) {
        await new Promise(resolve => setTimeout(resolve, interval))
    }

    public async generateAssists(interval: number, user: User, eventId: string | undefined, dataPerInterval: number = 1) {
        if (this.isCancelled) return

        const event = user.events.find((event: Event) => event.id === eventId)

        if (!event) {
            throw new Error("No se encontró el evento")
        }

        const formAssistsUser = user.forms.find((form: Form) => form.id === event.formAssists?.id)

        if (!formAssistsUser) {
            throw new Error("No se encontró el formulario de asistencias")
        }

        const dataGenerated = await generateSampleData(dataPerInterval, formAssistsUser, () => {
            if (this.isCancelled) return
        })

        if (this.isCancelled) return

        for (const data of dataGenerated) {
            if (this.isCancelled) break

            const payload = {
                idEvent: eventId,
                typeForm: "assists",
                data: data
            }
            this.socket?.emit("UPDATE_EVENT_FORMS", payload)
        }

        if (!this.isCancelled) {
            await new Promise(resolve => setTimeout(resolve, interval))
        }
    }

    public async generateInscriptions(interval: number, user: User, eventId: string | undefined, dataPerInterval: number = 1) {
        if (this.isCancelled) return

        const event = user.events.find((event: Event) => event.id === eventId)

        if (!event) {
            throw new Error("No se encontró el evento")
        }

        const formInscriptionsUser = user.forms.find((form: Form) => form.id === event.formInscriptions?.id)

        if (!formInscriptionsUser) {
            throw new Error("No se encontró el formulario de inscripciones")
        }

        const dataGenerated = await generateSampleData(dataPerInterval, formInscriptionsUser, () => {
            if (this.isCancelled) return
        })

        if (this.isCancelled) return

        for (const data of dataGenerated) {
            if (this.isCancelled) break

            const payload = {
                idEvent: eventId,
                typeForm: "inscriptions",
                data: data
            }
            this.socket?.emit("UPDATE_EVENT_FORMS", payload)
        }

        if (!this.isCancelled) {
            await new Promise(resolve => setTimeout(resolve, interval))
        }
    }
}
