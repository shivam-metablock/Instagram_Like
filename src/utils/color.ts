 export const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            VIEWS: 'bg-gradient-to-r from-purple-500 to-pink-500',
            LIKES: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            FOLLOWERS: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            BUNDLE: 'bg-green-500/20 text-green-400 border-green-500/30',
            APPROVED: 'bg-green-500/20 text-green-400 border-green-500/30',
            REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
            INSTAGRAM: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
            YOUTUBE: 'bg-red-500/20 text-red-400 border-red-500/30',
            TELEGRAM: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
            FACEBOOK: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        };
        return colors[type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }