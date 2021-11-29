import Table from 'react-bootstrap/Table'

const ElementRow = ({ rows }) => {
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

export default ElementRow
