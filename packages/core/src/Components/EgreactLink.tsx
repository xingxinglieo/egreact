import euiProps from '../Host/eui/index'
import { Link, LinkProps } from 'react-router-dom'
import { TransProp } from '../Host'

export const EgreactLink: React.ForwardRefExoticComponent<TransProp<typeof euiProps.label> & LinkProps> = Link as any
