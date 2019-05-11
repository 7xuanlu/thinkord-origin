import React, { Component } from 'react'
import PropTypes from 'prop-types';
import AddDescription from './AddDescription';

/**************************************************************************************/
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
// import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
/**************************************************************************************/

const styles = theme => ({
    card: {
        maxWidth: 600,
        background: '#d0d0d0	'
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
});

export class TodoItem extends Component {
    state = { expanded: false };

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };

    getStyle = () => {
        return {
            bakground: '#f4f4f4',
            padding: '10px'
        }
    }


    render() {
        // console.log(this.props)
        const { classes } = this.props;
        const { id, title, description, time } = this.props.todo;
        return (
            <Card className={classes.card}>
                <div style={this.getStyle()}>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="Programming" className={classes.avatar} style={{ backgroundColor: '#5cadad' }}>
                                P
                            </Avatar>
                        }
                        action={
                            <IconButton>
                                <MoreVertIcon />
                            </IconButton>
                        }
                        title={title}
                        subheader={time} />


                    <CardContent>
                        <Typography component="p">
                            {description}
                        </Typography>
                        <br></br>
                        <br></br>
                        <br></br>
                        <AddDescription
                            addDescription={this.props.addDescription}
                            id={id}
                            title={title}
                        />
                    </CardContent>

                    <CardActions className={classes.actions} disableActionSpacing>

                        <button onClick={this.props.delTodo.bind(this, id)}
                            style={btnStyle}
                            size="small">delete</button>

                        <IconButton
                            className={classnames(classes.expand, {
                                [classes.expandOpen]: this.state.expanded,
                            })}
                            onClick={this.handleExpandClick}
                            aria-expanded={this.state.expanded}
                            aria-label="Show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </CardActions>
                    <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography paragraph>Method:</Typography>
                            <Typography paragraph>
                                Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                                minutes.
                            </Typography>
                            <Typography paragraph>
                                Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                                heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                                browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving
                                chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion,
                                salt and pepper, and cook, stirring often until thickened and fragrant, about 10
                                minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
                            </Typography>
                            <Typography paragraph>
                                Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                                without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat
                                to medium-low, add reserved shrimp and mussels, tucking them down into the rice, and
                                cook again without stirring, until mussels have opened and rice is just tender, 5 to 7
                                minutes more. (Discard any mussels that don’t open.)
                            </Typography>
                            <Typography>
                                Set aside off of the heat to let rest for 10 minutes, and then serve.
                            </Typography>
                        </CardContent>
                    </Collapse>



                </div>
            </Card>

        )
    }
}

TodoItem.propTypes = {
    todo: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

const btnStyle = {
    background: '#AAAAAA',
    color: '#fff',
    border: '1px',
    padding: '2px 4px',
    borderRadius: '8%',
    cursor: 'pointer',
    float: 'right'
}


export default withStyles(styles)(TodoItem)
