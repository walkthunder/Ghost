/** eslint-disable-block */
var _ = require('lodash'),
    uuid = require('uuid'),
    ObjectId = require('bson-objectid'),
    moment = require('moment'),
    models = require('../models'),
    constants = require('../lib/constants'),
    DataGenerator = {};

models.init();

DataGenerator.markdownToMobiledoc = function markdownToMobiledoc(content) {
    var mobiledoc = {
        version: '0.3.1',
        markups: [],
        atoms: [],
        cards: [
            ['markdown', {
                cardName: 'markdown',
                markdown: content || ''
            }]
        ],
        sections: [[10, 0]]
    };
    return JSON.stringify(mobiledoc);
};

DataGenerator.Content = {
    posts: [{
        id: ObjectId.generate(),
        title: 'HTML Ipsum',
        slug: 'html-ipsum',
        mobiledoc: DataGenerator.markdownToMobiledoc('<h1>HTML Ipsum Presents</h1><p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href=\\\"#\\\">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p><h2>Header Level 2</h2><ol><li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li><li>Aliquam tincidunt mauris eu risus.</li></ol><blockquote><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna. Cras in mi at felis aliquet congue. Ut a est eget ligula molestie gravida. Curabitur massa. Donec eleifend, libero at sagittis mollis, tellus est malesuada tellus, at luctus turpis elit sit amet quam. Vivamus pretium ornare est.</p></blockquote><h3>Header Level 3</h3><ul><li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li><li>Aliquam tincidunt mauris eu risus.</li></ul><pre><code>#header h1 a{display: block;width: 300px;height: 80px;}</code></pre>'),
        published_at: new Date(),
        custom_excerpt: 'This is my custom excerpt!',
        feature_image: 'https://casper.ghost.org/v1.0.0/images/writing.jpg'
    }],
    tags: [{
        id: ObjectId.generate(),
        name: 'kitchen sink',
        slug: 'kitchen-sink',
        feature_image: 'https://casper.ghost.org/v1.0.0/images/writing.jpg'
    }],
    users: [{
        // owner (owner is still id 1 because of permissions)
        id: '1',
        name: 'Joe Bloggs',
        slug: 'joe-bloggs',
        email: 'jbloggs@example.com',
        password: 'Sl1m3rson99',
        profile_image: 'https://casper.ghost.org/v1.0.0/images/writing.jpg'
    }]
};

function createPost(overrides) {
    overrides = overrides || {};

    var newObj = _.cloneDeep(overrides),
        mobiledocObj;

    if (!newObj.mobiledoc) {
        newObj.mobiledoc = DataGenerator.markdownToMobiledoc('## markdown');
    }

    if (!newObj.html) {
        mobiledocObj = JSON.parse(newObj.mobiledoc);
        newObj.html = mobiledocObj.cards && mobiledocObj.cards[0][1].markdown;
    }

    return models.User.findOne({
        name: 'Ghost'
    }).then(function (collector = {}) {
        let postData = _.defaults(newObj, {
            id: ObjectId.generate(),
            uuid: uuid.v4(),
            title: 'iInsert002',
            status: 'published',
            feature_image: null,
            featured: false,
            page: false,
            author_id: collector.id || DataGenerator.Content.users[0].id,
            updated_at: new Date(),
            updated_by: collector.id || DataGenerator.Content.users[0].id,
            created_at: new Date(),
            created_by: collector.id || DataGenerator.Content.users[0].id,
            published_at: new Date(),
            published_by: collector.id || DataGenerator.Content.users[0].id,
            visibility: 'public'
        });
        return models.Post.add(postData)
            .then(function onModelResponse(model) {
                var post = model.toJSON();
                return {posts: [post]};
            });
    });
}
const html = '<section><body><h2>H2 Title</h2><p>body content</p></body></section>';
const mockData = {
    title: 'iInsert003',
    slug: 'html-ipsum',
    html,
    mobiledoc: DataGenerator.markdownToMobiledoc(html),
    published_at: new Date(),
    custom_excerpt: html,
    feature_image: 'https://casper.ghost.org/v1.0.0/images/writing.jpg'
};

createPost(mockData);
