import ClassDetailsClient from './client';

export default function ClassDetailsPage({ params }) {
    return <ClassDetailsClient classId={params.classId} />;
} 