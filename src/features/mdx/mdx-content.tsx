import * as runtime from 'react/jsx-runtime'

const sharedComponents = {
}

// parse the Velite generated MDX code into a React component function
function useMDXComponent(code: string) {
  // eslint-disable-next-line no-new-func
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

interface MDXProps {
  code: string
  components?: Record<string, React.ComponentType>
}

// MDXContent component
export function MDXContent({ code, components }: MDXProps) {
  const Component = useMDXComponent(code)
  return (
    <article className="prose dark:prose-invert max-w-none">
      <Component components={{ ...sharedComponents, ...components }} />
    </article>
  )
}
