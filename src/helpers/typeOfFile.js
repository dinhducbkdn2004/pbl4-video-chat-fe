export default function typeOfFile(file) {
    const { type, name } = file;

    if (type.startsWith('image/')) {
        return 'Picture';
    }
    if (type.startsWith('video/')) {
        return 'Video';
    }

    if (name.endsWith('.zip') || name.endsWith('.rar') || type.startsWith('application/')) {
        return 'Document';
    }

    return 'Link';
}
