import { useState } from 'react'

function useInput<T>(initialValue: T) {
  const [value, setValue] = useState(initialValue)

  return {
    value,
    setValue,
    reset: () => setValue(initialValue),
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
