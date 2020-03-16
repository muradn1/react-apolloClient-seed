import React, { Component } from 'react'
import { Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { RouterEnum } from '../../enums/router-enum'

export default class StartupMenu extends Component {
    render() {
        return (
            <div>
                <Button><Link to={RouterEnum.COMPLEX}>COMPLEX</Link></Button>
                <Button><Link to={RouterEnum.SIMPLE}>SIMPLE</Link></Button>
            </div>
        )
    }
}
