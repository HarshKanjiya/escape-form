"use client";

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Response } from '@/generated/prisma';
import { useState } from 'react';


const generateId = () =>
    'resp_' + Math.random().toString(36).substring(2, 11);

const responses: Response[] = [
    {
        id: generateId(),
        userId: 'user_123',
        data: { name: "Alice Smith", email: "alice@example.com" },
        metaData: { ip: "192.168.1.1" },
        tags: ["lead", "priority"],
        status: "COMPLETED",
        notified: false,
        partialSave: false,
        valid: true,
        startedAt: new Date(Date.now() - 7200000), // 2 hours ago
        submittedAt: new Date(Date.now() - 6000000), // ~100 min ago
        updatedAt: new Date(Date.now() - 6000000),
        formId: generateId(),
    },
    {
        id: generateId(),
        userId: null,
        data: { name: "Bob Johnson" },
        metaData: { ip: "10.0.0.5" },
        tags: ["abandoned"],
        status: "ABANDONED",
        partialSave: true,
        notified: false,
        valid: false,
        startedAt: new Date(Date.now() - 3600000), // 1 hour ago
        submittedAt: null,
        updatedAt: new Date(Date.now() - 120000),
        formId: generateId(),
    },
    {
        id: generateId(),
        userId: 'user_456',
        data: { subject: "Feedback", rating: 5 },
        metaData: {},
        tags: [],
        status: "COMPLETED",
        partialSave: false,
        notified: false,
        valid: true,
        startedAt: new Date(Date.now() - 1800000), // 30 min ago
        submittedAt: new Date(Date.now() - 1700000), // 28 min ago
        updatedAt: new Date(Date.now() - 1700000),
        formId: generateId(),
    },
    {
        id: generateId(),
        userId: null,
        data: { name: "Charlie" },
        metaData: { device: "Mobile" },
        tags: ["mobile"],
        status: "ABANDONED",
        partialSave: true,
        notified: false,
        valid: true,
        startedAt: new Date(Date.now() - 900000), // 15 min ago
        submittedAt: null,
        updatedAt: new Date(Date.now() - 60000),
        formId: generateId(),
    },
    {
        id: generateId(),
        userId: 'user_789',
        data: { age: 35, city: "London" },
        metaData: { referrer: "Google" },
        tags: ["web"],
        status: "COMPLETED",
        notified: false,
        partialSave: false,
        valid: true,
        startedAt: new Date(Date.now() - 600000), // 10 min ago
        submittedAt: new Date(Date.now() - 500000), // 8 min ago
        updatedAt: new Date(Date.now() - 500000),
        formId: generateId(),
    },
];

const PreviewResponses = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);


    return (
        <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between gap-2'>
                <div className='flex flex-col gap-2'>
                    <h2 className="text-2xl font-bold">Form Submissions</h2>
                    <span className="text-muted-foreground">
                        Preview of the latest responses submitted through your form
                    </span>
                </div>
                <Button>
                    View All
                </Button>
            </div>
            <div className='border rounded-lg'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead>Started</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead>Data</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {responses.map((resp) => (
                            <TableRow key={resp.id}>
                                <TableCell>{resp.userId ?? <span className="italic text-gray-400">Anonymous</span>}</TableCell>
                                <TableCell>
                                    <span className={resp.status === "COMPLETED" ? "text-green-600 dark:text-green-400 font-semibold" : "text-yellow-600 dark:text-yellow-400 font-semibold"}>
                                        {resp.status}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {resp.tags.length ? resp.tags.map(tag => (
                                        <span key={tag} className="inline-block bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200 rounded px-2 py-0.5 text-xs mr-1">{tag}</span>
                                    )) : <span className="text-gray-400">-</span>}
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-xs">{resp.startedAt ? new Date(resp.startedAt).toLocaleTimeString() : '-'}</TableCell>
                                <TableCell className="whitespace-nowrap text-xs">{resp.submittedAt ? new Date(resp.submittedAt).toLocaleTimeString() : '-'}</TableCell>
                                <TableCell>
                                    <pre className="text-xs max-w-[200px] whitespace-pre-wrap break-words bg-muted/40 rounded p-1 overflow-x-auto">{JSON.stringify(resp.data, null, 0)}</pre>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default PreviewResponses