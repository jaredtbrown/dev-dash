import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import orderBy from 'lodash.orderby';
import GitHubApiClient from '../../githubApiClient';
import WorkflowStatus from '../../components/WorkflowStatus';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { WorkflowIcon } from '@primer/octicons-react';

const WorkflowRuns = (props) => {
    const [workflowRuns, setWorkflowRuns] = useState([]);

    useEffect(() => {
        const getRepos = async () => {
            const token = localStorage.getItem('token');
            const gitHubApiClient = new GitHubApiClient(token);
            return await gitHubApiClient.get(`${props.resource}/repos`);
        }

        const getAllRepoWorkflows = async () => {
            const repos = await getRepos();
            let allWorkflowRuns = [];
            for (const repo of repos) {
                const token = localStorage.getItem('token');
                const gitHubApiClient = new GitHubApiClient(token);
                const response = await gitHubApiClient.get(`/repos/${repo.full_name}/actions/runs`);
                allWorkflowRuns = [...allWorkflowRuns, ...response.workflow_runs];
            }

            const orderedRuns = orderBy(allWorkflowRuns, ['created_at'], ['desc']);
            setWorkflowRuns(orderedRuns);
        }
        getAllRepoWorkflows();
    }, [props.resource]);

    const renderWorkflowRun = (run) => {
        return (
            <TableRow key={run.id} onClick={() => { window.open(run.html_url, '_blank') }} style={{ cursor: 'pointer' }}>
                <TableCell>
                    <WorkflowStatus status={run.status} conclusion={run.conclusion} />&nbsp;
                    {run.name}
                </TableCell>
                <TableCell>
                    <Link color="inherit" href={run.repository.html_url} target="_blank" rel="noreferrer">{run.repository.name}</Link>
                </TableCell>
                <TableCell>
                    {run.created_at}
                </TableCell>
            </TableRow>
        )
    };

    return (
        <Card>
            <CardHeader
                title={
                    <Typography variant="h5">
                        <WorkflowIcon size="medium" />&nbsp; Workflow Runs
                    </Typography>
                }
            />
            <CardContent>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Name
                            </TableCell>
                            <TableCell>
                                Repo
                            </TableCell>
                            <TableCell>
                                Created
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {workflowRuns.map(renderWorkflowRun)}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
 
export default WorkflowRuns;