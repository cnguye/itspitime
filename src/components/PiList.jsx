import React from 'react'

import Table from 'react-bootstrap/Table'

function PiList() {
    return (
        <div className="piList__body">
            <div className="piList__header">Watch list</div>
            <Table className="piList__table" striped bordered hover>
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Model</th>
                        <th>Link</th>
                        <th>Cost</th>
                        <th>Last Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    <tr>
                        <td>22315ASD</td>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td colSpan={4}>Larry the Bird</td>
                        <td>@twitter</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}

export default PiList