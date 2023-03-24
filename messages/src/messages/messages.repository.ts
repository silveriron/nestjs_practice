import { readFile, writeFile } from 'fs/promises';

export class MessagesRepository {
  async findAll() {
    const contents = await readFile('messages.json', 'utf-8');
    const messages = JSON.parse(contents);
    return messages;
  }

  async findOne(id: string) {
    const contents = await this.findAll();
    return contents[id];
  }

  async create(content: string) {
    const id = Math.floor(Math.random() * 600);
    const contents = await this.findAll();
    contents[id] = { id, content };
    await writeFile('messages.json', JSON.stringify(contents));
  }
}
