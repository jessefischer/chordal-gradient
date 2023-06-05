export const Backdrop = ({ background, opacity }: { background: string | undefined, opacity: number }) => <div
    className="backdrop"
    style={{
        background,
        opacity,
    }}
/>
