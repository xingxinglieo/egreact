import euiProps from '../Host/eui/index'
import { Link, LinkProps } from 'react-router-dom'
import { TransProp } from '../Host'
import React from 'react'

export const EgreactLink: React.ForwardRefExoticComponent<TransProp<typeof euiProps.label> & LinkProps> = Link as any
