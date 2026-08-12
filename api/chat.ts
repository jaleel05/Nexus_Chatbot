import { POST } from '../app/api/chat/route';

export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    return POST(req);
}