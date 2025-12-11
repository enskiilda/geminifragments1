import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getTemplateId, Templates } from '@/lib/templates'
import { Sparkles } from 'lucide-react'
import Image from 'next/image'

export function TemplatePicker({
  templates,
  selectedTemplate,
  onSelectedTemplateChange,
}: {
  templates: Templates
  selectedTemplate: string
  onSelectedTemplateChange: (template: string) => void
}) {
  return (
    <Select
      name="template"
      defaultValue={selectedTemplate}
      onValueChange={onSelectedTemplateChange}
    >
      <SelectTrigger className="whitespace-nowrap border-none shadow-none focus:ring-0 px-0 py-0 h-8 text-sm justify-start w-full">
        <SelectValue placeholder="Select a persona" />
      </SelectTrigger>
      <SelectContent side="top">
        <SelectGroup>
          <SelectLabel>Persona</SelectLabel>
          <SelectItem value="auto">
            <div className="flex items-center space-x-2">
              <Sparkles
                className="flex text-[#a1a1aa]"
                width={18}
                height={18}
              />
              <span>Auto</span>
            </div>
          </SelectItem>
          {Object.entries(templates).map(([templateId, template]) => (
            <SelectItem key={templateId} value={templateId}>
              <div className="flex items-center space-x-2">
                <Image
                  className="flex"
                  src={`/thirdparty/templates/${getTemplateId(
                    templateId,
                  )}.svg`}
                  alt={templateId}
                  width={18}
                  height={18}
                />
                <span>{template.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
