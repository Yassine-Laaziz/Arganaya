import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = sanityClient({
    projectId: 'hbs846uh',
    dataset: 'production',
    apiVersion: '2022-10-16',
    useCdn: false,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
    ignoreBrowserTokenWarning: true
})

const builder = imageUrlBuilder(client)

export const urlFor = source => builder.image(source)