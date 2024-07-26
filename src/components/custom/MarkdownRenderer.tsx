import ReactMarkdown from 'react-markdown';

const MarkdownRenderer = ({ markdownText }: { markdownText: string }) => {
    return (
        <ReactMarkdown
            components={{
                ul: ({ node, ...props }) => <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }} {...props} />,
                li: ({ node, ...props }) => <li {...props} />,
            }}
        >
            {markdownText}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;
