import { useState, useEffect } from 'react'
import style from './Select.module.css'

export type SelectOption = {
  label: string,
  value: string | number
}

type MultipleSelectProps = {
  multiple: true,
  value: SelectOption[],
  onChange: (value: SelectOption[]) => void
}

type SingleSelectProps = {
  multiple?: false,
  value?: SelectOption,
  onChange: (value: SelectOption | undefined) => void
}

type SelectProps = {
  options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps)

export function Select({ multiple, value, onChange, options }: SelectProps) {
  const [openMenu, setOpenMenu] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const handleClick = () => {
    multiple ? onChange([]) : onChange(undefined)
  }

  const handleSelectOption = (option: SelectOption) => {
    if(multiple) {
      if(value.includes(option)) {
        onChange(value.filter(o => o !== option))
      } else {
        onChange([...value, option])
      }
    } else {
      if(option !== value) onChange(option)
    }
  }

  const handleOptionSelected = (option: SelectOption) => {
    return multiple ? value.includes(option) : option === value;
  }

  const showMenu = openMenu ? style.show : '';
  const showSingleOrMultiSelect = multiple ? value.map(v => (
    <button
      className={style["option-badge"]}
      key={v.value}
      onClick={e => {
        e.stopPropagation()
        handleSelectOption(v)
      }}
    >
      {v.label}
      <span className={style["remove-btn"]}>&times;</span>
    </button>
  )) : value?.label;

  useEffect(() => {
    if(openMenu) setHighlightedIndex(0);
  }, [openMenu]);

  return (
    <div className={style.container} tabIndex={0} onClick={() => setOpenMenu(!openMenu)} onBlur={() => setOpenMenu(!openMenu)}>
      <span className={style.value}>{showSingleOrMultiSelect}</span>
      <button
        className={style['clear-btn']}
        onClick={(e) => {
          e.stopPropagation()
          handleClick()
        }}
      >
          &times;
      </button>
      <div className={style.divider}></div>
      <div className={style.caret}></div>
      <ul className={`${style.options} ${showMenu}`}>
        {options.map((option, index) => (
          <li
            onClick={e => {
              e.stopPropagation()
              handleSelectOption(option)
              setOpenMenu(false)
            }}
            onMouseEnter={() => setHighlightedIndex(index)}
            key={option.value}
            className={`${style.option} ${handleOptionSelected(option) ? style.selected : ''} ${index === highlightedIndex ? style.highlighted : ''}`}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}