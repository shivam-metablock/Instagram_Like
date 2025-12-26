export const PLATFORM_SERVICES: Record<string, { value: string; label: string }[]> = {
    INSTAGRAM: [
        { value: 'VIEWS', label: 'Views Boost' },
        { value: 'LIKES', label: 'Likes Boost' },
        { value: 'FOLLOWERS', label: 'Followers Boost' },
        { value: 'BUNDLE', label: 'Bundle (Likes + Followers + Views)' },
    ],
    FACEBOOK: [
        { value: 'VIEWS', label: 'Views Boost' },
        { value: 'LIKES', label: 'Likes Boost' },
        { value: 'FOLLOWERS', label: 'Followers Boost' },
        { value: 'BUNDLE', label: 'Bundle (Likes + Followers + Views)' },
    ],
    YOUTUBE: [
        { value: 'VIEWS', label: 'Views Boost' },
        { value: 'LIKES', label: 'Likes Boost' },
        { value: 'FOLLOWERS', label: 'Subscribers Boost' },
        { value: 'BUNDLE', label: 'Bundle (Likes + Subs + Views)' },
    ],
    TELEGRAM: [
        { value: 'FOLLOWERS', label: 'Join Group/Channel' },
        { value: 'VIEWS', label: 'Post Views' },
    ]
};

export const getPlatformLabel = (platform: string | undefined, type: string) => {
    const p = platform || 'INSTAGRAM';
    return PLATFORM_SERVICES[p]?.find(s => s.value === type)?.label || type;
};
