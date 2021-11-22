import Table from 'react-bootstrap/Table'

const TableComponent = ({ rows, columns, striped }) => {
	return (
		<Table striped>
			<thead>
				<tr>
					{columns.map(col => (
						<th>{col}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{rows.map(row => (
					<tr>
						{row.map(data => (
							<td>{data}</td>
						))}
					</tr>
				))}
			</tbody>
		</Table>
	)
}

export default TableComponent
