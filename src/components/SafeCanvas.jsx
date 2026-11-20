import { Component } from 'react'
import { Canvas as R3FCanvas } from '@react-three/fiber'

// Si le navigateur ne peut pas créer de contexte WebGL, on masque seulement la scène 3D
// au lieu de faire disparaître tout le site.
class Boundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(err) { console.warn('Scène 3D désactivée :', err && err.message) }
  render() { return this.state.failed ? null : this.props.children }
}

export function Canvas(props) {
  return <Boundary><R3FCanvas {...props} /></Boundary>
}
