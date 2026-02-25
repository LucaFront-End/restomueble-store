import { types } from 'react-bricks/rsc'
import bricks from './bricks'

const config: types.ReactBricksConfig = {
    appId: process.env.NEXT_PUBLIC_REACT_BRICKS_APP_ID || '',
    apiKey: process.env.REACT_BRICKS_API_KEY || '',
    bricks,
    logo: '/logo.svg',
    contentClassName: 'font-sans',
    renderLocalLink: ({ href, children, className, activeClassName, ...rest }) => {
        // Use Next.js Link for local navigation
        const Link = require('next/link').default
        return (
            <Link href={href} className={className} {...rest
            } >
                {children}
            </Link>
        )
    },
    navigate: (path: string) => {
        if (typeof window !== 'undefined') {
            window.location.href = path
        }
    },
    loginPath: '/admin',
    editorPath: '/admin/editor',
    mediaLibraryPath: '/admin/media',
    playgroundPath: '/admin/playground',
    appSettingsPath: '/admin/app-settings',
    previewPath: '/preview',
    appRootElement: '#__next',
    pageTypes: [
        {
            name: 'page',
            pluralName: 'pages',
            defaultLocked: false,
            defaultStatus: types.PageStatus.Draft,
            getDefaultContent: () => [
                'hero-brick',
                'category-bento-brick',
                'bento-benefits-brick',
                'project-showcase-brick',
                'about-sticky-brick',
            ],
        },
    ],
}

export default config
