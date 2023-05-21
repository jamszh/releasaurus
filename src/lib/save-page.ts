import fs from 'fs';

const FILE_EXT = 'mdx'

export async function savePage(content: string, path: string, releaseName: string) {
  const dir = `./${path}`
  try {
    await fs.promises.mkdir(dir, { recursive: true })
    const filepath = `${dir}/${releaseName}.${FILE_EXT}`
    await fs.promises.writeFile(filepath, content, { flag: 'w+' });
    console.log(`${releaseName} notes saved at ${filepath}`)
  } catch (error) {
    throw new Error(`Cannot save page: ${error}`)
  }
}
