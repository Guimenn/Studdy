
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function Results() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recent Results</h2>
                <Button variant="outline" className="gap-2">
                    View All Results
                </Button>
            </div>
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead className="font-semibold">Exam Name</TableHead>
                                <TableHead className="font-semibold">Date</TableHead>
                                <TableHead className="font-semibold">Score</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="hover:bg-slate-50/50">
                                <TableCell className="font-medium">Chemistry Mock Test</TableCell>
                                <TableCell>May 10, 2025</TableCell>
                                <TableCell className="font-semibold text-green-600">85%</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1"
                                    >
                                        Passed
                                    </Badge>
                                </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-slate-50/50">
                                <TableCell className="font-medium">Biology Mock Test</TableCell>
                                <TableCell>May 8, 2025</TableCell>
                                <TableCell className="font-semibold text-green-600">72%</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1"
                                    >
                                        Passed
                                    </Badge>
                                </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-slate-50/50">
                                <TableCell className="font-medium">English Mock Test</TableCell>
                                <TableCell>May 5, 2025</TableCell>
                                <TableCell className="font-semibold text-yellow-600">68%</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 px-3 py-1"
                                    >
                                        Review
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    )
}