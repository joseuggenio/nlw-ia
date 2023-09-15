import { useEffect, useState } from "react";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { api } from "@/lib/axios";
import { SelectItem } from "@radix-ui/react-select";

interface Prompt {
    id: string,
    title: string,
    template: string
}

interface PromptSelectProps {
    onPromptSelected: (template: string) => void
}

export function PromptSelect(props: PromptSelectProps) {
    const [prompts, setPrompts] = useState<Prompt[] | null>(null)

    useEffect(() => {
        api.get('/prompts').then(response => {
            console.log(response.data)
            setPrompts(response.data)
        })
    }, [])

    function handlePromptSelected(promptId: string) {
        const seletedPrompts = prompts?.find(prompt => prompt.id === promptId)

        if (!seletedPrompts) {
            return
        }

        props.onPromptSelected(seletedPrompts.template)
    }

    return (
        <Select onValueChange={handlePromptSelected}>
            <SelectTrigger>
            <SelectValue placeholder="Selecione um prompt..."/>
            </SelectTrigger>
                <SelectContent>
                    {prompts?.map(prompt => {
                        return (
                            <SelectItem value={prompt.id} key={prompt.id}>{prompt.title}</SelectItem>
                        )
                    })}
                </SelectContent>
        </Select>
    )
}