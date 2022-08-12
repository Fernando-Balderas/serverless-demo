import { useState } from 'react'

const useInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue)

  return {
    value,
    setValue,
    reset: () => setValue(''),
    bind: {
      value,
      onChange: (event: React.SyntheticEvent<Element, Event>) => {
        // @ts-ignore
        setValue(event.target.value)
      },
      required: true,
    },
  }
}

export default useInput
