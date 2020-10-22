import styled from 'styled-components'

export const MasonryDiv = styled.div<{ gap?: string }>`
  display: grid;
  grid-auto-flow: column;
  grid-gap: ${props => props.gap || `1em`};
`
export const Col = styled.div<{ gap?: string }>`
  display: grid;
  grid-gap: ${props => props.gap || `1em`};
`