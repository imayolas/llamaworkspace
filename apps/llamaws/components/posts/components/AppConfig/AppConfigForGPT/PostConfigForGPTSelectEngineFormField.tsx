import { AppGptEngine } from 'components/posts/postsTypes'
import {
  SelectField,
  type SelectFieldProps,
} from 'components/ui/forms/SelectField'

const options = [
  { value: AppGptEngine.OpenaiAssistant, label: 'OpenAI' },
  { value: AppGptEngine.Basic, label: 'Basic' },
]

export const PostConfigForGPTSelectEngineFormField = ({
  ...selectProps
}: Omit<SelectFieldProps, 'options'>) => {
  return <SelectField {...selectProps} options={options} />
}