import { Avatar as ChakraAvatar } from "@chakra-ui/react"
import * as React from "react"

export interface AvatarProps extends ChakraAvatar.RootProps {
  name?: string
  src?: string
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  function Avatar(props, ref) {
    const { name, src, ...rest } = props
    return (
      <ChakraAvatar.Root ref={ref} {...rest}>
        <ChakraAvatar.Fallback>{name?.[0]}</ChakraAvatar.Fallback>
        {src && <ChakraAvatar.Image src={src} alt={name} />}
      </ChakraAvatar.Root>
    )
  }
)
