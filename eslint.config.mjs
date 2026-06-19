import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = [
  ...nextVitals,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      // Keep the rescue PR focused on deployment/runtime. The existing UI can
      // be migrated to the stricter React compiler lint rules in a separate pass.
      'react-hooks/immutability': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    ignores: [
      '.next/**',
      '.open-next/**',
      '.wrangler/**',
      'android/**',
      'out/**',
      'worker-configuration.d.ts',
    ],
  },
]

export default eslintConfig
