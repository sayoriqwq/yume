import type { MDXRemoteProps } from 'next-mdx-remote/rsc'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import { components, rehypePrettyCodeOptions } from './components/components'

export function CustomMDX(props: MDXRemoteProps) {
  return (
    <MDXRemote
      // eslint-disable-next-line react/prefer-destructuring-assignment
      components={{ ...components, ...props.components }}
      options={{
        mdxOptions: {
          rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
        },
      }}
      {...props}
    />
  )
}
