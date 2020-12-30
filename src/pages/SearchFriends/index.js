import React, {Component} from 'react'
import {Grid, Loader, List, Image, Message, Input, Card, Container} from 'semantic-ui-react'
import {searchFriend} from "../../utils/requests";
import InfiniteScroll from "react-infinite-scroller";
import defaultAvatar from "../../assets/images/user.png";
import BackendError from "../../components/BackendError";

export default class SearchFriends extends Component {
    constructor(props) {
        super(props);
        this.state = {isLoading:  false, results: [], value: '', backendError: null, page: 1, total: 1};
        this.handleChange = this.handleChange.bind(this);
        this.resetScroll = this.resetScroll.bind(this);
    }
    loadMoreFriends = (page) => {
        if(this.state.total >= page){
            searchFriend(this, this.state.value, page);
        }
    };
    handleChange(e,{value}){
        if(value.trim() !== ''){
            this.setState({isLoading: true, value, page: 1});
            searchFriend(this,value)
        }else{
            this.resetScroll();
        }
    }
    resetScroll() {
        this.setState({
            page: 1,
            total: 1,
            value: ''
        })
    }

    render() {
        const { isLoading, value, results, backendError, page, total } = this.state;

        return (
            <Container textAlign={"center"}>
                    <h5>
                        Search for friends
                    </h5>
                    <Input icon='search' size="big" onChange={this.handleChange}
                   loading={isLoading} placeholder='Search...' />
                    {results && <div className="lazy-parent" key={value}>
                        <InfiniteScroll
                        pageStart={page}
                        loadMore={this.loadMoreFriends}
                        hasMore={total > page}
                        loader={<Loader active inline='centered' />}
                        className="lazy"
                        useWindow={false}
                    >
                            <Grid>

                                <Grid.Row>

                                    {results.map(friend => (
                                        <Grid.Column mobile={16} tablet={8} computer={4} key={friend._id} onClick={() => this.props.history.push(`/auth/profile/${friend?._id}`)}>
                                            <Card
                                                image={friend.avatar ? friend.avatar : defaultAvatar}
                                                header={friend.name ? friend.name : ''}
                                                meta={friend.email ? friend.email : friend.phone}
                                            />
                                        </Grid.Column>
                                    ))}

                                </Grid.Row>

                            </Grid>
                    </InfiniteScroll>
                    </div>}

                    {value !== '' && results?.length === 0 && <Message negative>
                        <Message.Header>No Results</Message.Header>
                    </Message>}

                    {backendError && <BackendError error={backendError}/> }
            </Container>
        )
    }
}