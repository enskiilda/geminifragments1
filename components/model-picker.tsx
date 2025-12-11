import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LLMModel, LLMModelConfig } from '@/lib/models'
import Image from 'next/image'

export function ModelPicker({
  models,
  languageModel,
  onLanguageModelChange,
}: {
  models: LLMModel[]
  languageModel: LLMModelConfig
  onLanguageModelChange: (config: LLMModelConfig) => void
}) {
  const currentModel = models.find((m) => m.id === languageModel.model)

  return (
    <Select
      name="languageModel"
      defaultValue={languageModel.model}
      onValueChange={(e) => onLanguageModelChange({ model: e })}
    >
      <SelectTrigger className="whitespace-nowrap border-none shadow-none focus:ring-0 px-0 py-0 h-8 text-sm justify-start w-full">
        <div className="flex items-center space-x-2">
          <Image
            src={`/thirdparty/logos/${currentModel?.providerId}.svg`}
            alt="Model"
            width={18}
            height={18}
          />
          <span>{currentModel?.name || 'Select model'}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(
          Object.groupBy(models, ({ provider }) => provider),
        ).map(([provider, models]) => (
          <SelectGroup key={provider}>
            <SelectLabel>{provider}</SelectLabel>
            {models?.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <div className="flex items-center space-x-2">
                  <Image
                    className="flex"
                    src={`/thirdparty/logos/${model.providerId}.svg`}
                    alt={model.provider}
                    width={18}
                    height={18}
                  />
                  <span>{model.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}
