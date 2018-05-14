module.exports = {
    crawl_sites: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        res_url: {type: 'string', maxlength: 2000, nullable: false},
        status: {type: 'string', maxlength: 24, nullable: false, defaultTo: 'open'},
        interval: {type: 'string', maxlength: 24, nullable: false, defaultTo: '60'},
        query_rule: {type: 'string', maxlength: 2000, nullable: true},
        created_at: {type: 'dateTime', nullable: false},
        updated_at: {type: 'dateTime', nullable: true}
    },
    crawls_links: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        crawl_from: {type: 'string', maxlength: 24, nullable: false, primary: true},
        status: {type: 'string', maxlength: 24, nullable: false, defaultTo: 'pending'},
        post_id: {type: 'string', maxlength: 24, nullable: true},
        query_rule: {type: 'string', maxlength: 2000, nullable: true},
        created_at: {type: 'dateTime', nullable: false},
        updated_at: {type: 'dateTime', nullable: true},
        sort_order: {type: 'integer', nullable: false, unsigned: true, defaultTo: 0}
    },
    posts: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        uuid: {type: 'string', maxlength: 36, nullable: false, validations: {isUUID: true}},
        title: {type: 'string', maxlength: 2000, nullable: false, validations: {isLength: {max: 255}}},
        slug: {type: 'string', maxlength: 191, nullable: false, unique: true},
        mobiledoc: {type: 'text', maxlength: 1000000000, fieldtype: 'long', nullable: true},
        html: {type: 'text', maxlength: 1000000000, fieldtype: 'long', nullable: true},
        amp: {type: 'text', maxlength: 1000000000, fieldtype: 'long', nullable: true},
        plaintext: {type: 'text', maxlength: 1000000000, fieldtype: 'long', nullable: true},
        feature_image: {type: 'string', maxlength: 2000, nullable: true},
        featured: {type: 'bool', nullable: false, defaultTo: false},
        page: {type: 'bool', nullable: false, defaultTo: false},
        status: {type: 'string', maxlength: 50, nullable: false, defaultTo: 'draft'},
        locale: {type: 'string', maxlength: 6, nullable: true},
        visibility: {
            type: 'string',
            maxlength: 50,
            nullable: false,
            defaultTo: 'public',
            validations: {isIn: [['public']]}
        },
        meta_title: {type: 'string', maxlength: 2000, nullable: true, validations: {isLength: {max: 300}}},
        meta_description: {type: 'string', maxlength: 2000, nullable: true, validations: {isLength: {max: 500}}},
        /**
         * @deprecated: `author_id`, will be (maybe) removed in Ghost 2.0
         * If we keep it, then only, because you can easier query post.author_id than posts_authors[*].sort_order.
         */
        author_id: {type: 'string', maxlength: 24, nullable: false},
        created_at: {type: 'dateTime', nullable: false},
        created_by: {type: 'string', maxlength: 24, nullable: false},
        updated_at: {type: 'dateTime', nullable: true},
        updated_by: {type: 'string', maxlength: 24, nullable: true},
        published_at: {type: 'dateTime', nullable: true},
        published_by: {type: 'string', maxlength: 24, nullable: true},
        custom_excerpt: {type: 'string', maxlength: 2000, nullable: true, validations: {isLength: {max: 300}}},
        codeinjection_head: {type: 'text', maxlength: 65535, nullable: true},
        codeinjection_foot: {type: 'text', maxlength: 65535, nullable: true},
        og_image: {type: 'string', maxlength: 2000, nullable: true},
        og_title: {type: 'string', maxlength: 300, nullable: true},
        og_description: {type: 'string', maxlength: 500, nullable: true},
        twitter_image: {type: 'string', maxlength: 2000, nullable: true},
        twitter_title: {type: 'string', maxlength: 300, nullable: true},
        twitter_description: {type: 'string', maxlength: 500, nullable: true},
        custom_template: {type: 'string', maxlength: 100, nullable: true}
    },
    users: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        name: {type: 'string', maxlength: 191, nullable: false},
        slug: {type: 'string', maxlength: 191, nullable: false, unique: true},
        ghost_auth_access_token: {type: 'string', maxlength: 32, nullable: true},
        ghost_auth_id: {type: 'string', maxlength: 24, nullable: true},
        password: {type: 'string', maxlength: 60, nullable: false},
        email: {type: 'string', maxlength: 191, nullable: false, unique: true, validations: {isEmail: true}},
        profile_image: {type: 'string', maxlength: 2000, nullable: true},
        cover_image: {type: 'string', maxlength: 2000, nullable: true},
        bio: {type: 'text', maxlength: 65535, nullable: true, validations: {isLength: {max: 200}}},
        website: {type: 'string', maxlength: 2000, nullable: true, validations: {isEmptyOrURL: true}},
        location: {type: 'text', maxlength: 65535, nullable: true, validations: {isLength: {max: 150}}},
        facebook: {type: 'string', maxlength: 2000, nullable: true},
        twitter: {type: 'string', maxlength: 2000, nullable: true},
        accessibility: {type: 'text', maxlength: 65535, nullable: true},
        status: {type: 'string', maxlength: 50, nullable: false, defaultTo: 'active'},
        locale: {type: 'string', maxlength: 6, nullable: true},
        visibility: {
            type: 'string',
            maxlength: 50,
            nullable: false,
            defaultTo: 'public',
            validations: {isIn: [['public']]}
        },
        meta_title: {type: 'string', maxlength: 2000, nullable: true, validations: {isLength: {max: 300}}},
        meta_description: {type: 'string', maxlength: 2000, nullable: true, validations: {isLength: {max: 500}}},
        tour: {type: 'text', maxlength: 65535, nullable: true},
        last_seen: {type: 'dateTime', nullable: true},
        created_at: {type: 'dateTime', nullable: false},
        created_by: {type: 'string', maxlength: 24, nullable: false},
        updated_at: {type: 'dateTime', nullable: true},
        updated_by: {type: 'string', maxlength: 24, nullable: true}
    },
    posts_authors: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        post_id: {type: 'string', maxlength: 24, nullable: false, references: 'posts.id'},
        author_id: {type: 'string', maxlength: 24, nullable: false, references: 'users.id'},
        sort_order: {type: 'integer', nullable: false, unsigned: true, defaultTo: 0}
    },
    roles: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        name: {type: 'string', maxlength: 50, nullable: false, unique: true},
        description: {type: 'string', maxlength: 2000, nullable: true},
        created_at: {type: 'dateTime', nullable: false},
        created_by: {type: 'string', maxlength: 24, nullable: false},
        updated_at: {type: 'dateTime', nullable: true},
        updated_by: {type: 'string', maxlength: 24, nullable: true}
    },
    roles_users: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        role_id: {type: 'string', maxlength: 24, nullable: false},
        user_id: {type: 'string', maxlength: 24, nullable: false}
    },
    permissions: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        name: {type: 'string', maxlength: 50, nullable: false, unique: true},
        object_type: {type: 'string', maxlength: 50, nullable: false},
        action_type: {type: 'string', maxlength: 50, nullable: false},
        object_id: {type: 'string', maxlength: 24, nullable: true},
        created_at: {type: 'dateTime', nullable: false},
        created_by: {type: 'string', maxlength: 24, nullable: false},
        updated_at: {type: 'dateTime', nullable: true},
        updated_by: {type: 'string', maxlength: 24, nullable: true}
    },
    permissions_users: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        user_id: {type: 'string', maxlength: 24, nullable: false},
        permission_id: {type: 'string', maxlength: 24, nullable: false}
    },
    permissions_roles: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        role_id: {type: 'string', maxlength: 24, nullable: false},
        permission_id: {type: 'string', maxlength: 24, nullable: false}
    },
    permissions_apps: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        app_id: {type: 'string', maxlength: 24, nullable: false},
        permission_id: {type: 'string', maxlength: 24, nullable: false}
    },
    settings: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        key: {type: 'string', maxlength: 50, nullable: false, unique: true},
        value: {type: 'text', maxlength: 65535, nullable: true},
        type: {
            type: 'string',
            maxlength: 50,
            nullable: false,
            defaultTo: 'core',
            validations: {isIn: [['core', 'blog', 'theme', 'app', 'plugin', 'private']]}
        },
        created_at: {type: 'dateTime', nullable: false},
        created_by: {type: 'string', maxlength: 24, nullable: false},
        updated_at: {type: 'dateTime', nullable: true},
        updated_by: {type: 'string', maxlength: 24, nullable: true}
    },
    tags: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        name: {type: 'string', maxlength: 191, nullable: false, validations: {matches: /^([^,]|$)/}},
        slug: {type: 'string', maxlength: 191, nullable: false, unique: true},
        description: {type: 'text', maxlength: 65535, nullable: true, validations: {isLength: {max: 500}}},
        feature_image: {type: 'string', maxlength: 2000, nullable: true},
        parent_id: {type: 'string', nullable: true},
        visibility: {
            type: 'string',
            maxlength: 50,
            nullable: false,
            defaultTo: 'public',
            validations: {isIn: [['public', 'internal']]}
        },
        meta_title: {type: 'string', maxlength: 2000, nullable: true, validations: {isLength: {max: 300}}},
        meta_description: {type: 'string', maxlength: 2000, nullable: true, validations: {isLength: {max: 500}}},
        created_at: {type: 'dateTime', nullable: false},
        created_by: {type: 'string', maxlength: 24, nullable: false},
        updated_at: {type: 'dateTime', nullable: true},
        updated_by: {type: 'string', maxlength: 24, nullable: true}
    },
    posts_tags: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        post_id: {type: 'string', maxlength: 24, nullable: false, references: 'posts.id'},
        tag_id: {type: 'string', maxlength: 24, nullable: false, references: 'tags.id'},
        sort_order: {type: 'integer', nullable: false, unsigned: true, defaultTo: 0}
    },
    apps: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        name: {type: 'string', maxlength: 191, nullable: false, unique: true},
        slug: {type: 'string', maxlength: 191, nullable: false, unique: true},
        version: {type: 'string', maxlength: 50, nullable: false},
        status: {type: 'string', maxlength: 50, nullable: false, defaultTo: 'inactive'},
        created_at: {type: 'dateTime', nullable: false},
        created_by: {type: 'string', maxlength: 24, nullable: false},
        updated_at: {type: 'dateTime', nullable: true},
        updated_by: {type: 'string', maxlength: 24, nullable: true}
    },
    app_settings: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        key: {type: 'string', maxlength: 50, nullable: false, unique: true},
        value: {type: 'text', maxlength: 65535, nullable: true},
        app_id: {type: 'string', maxlength: 24, nullable: false, references: 'apps.id'},
        created_at: {type: 'dateTime', nullable: false},
        created_by: {type: 'string', maxlength: 24, nullable: false},
        updated_at: {type: 'dateTime', nullable: true},
        updated_by: {type: 'string', maxlength: 24, nullable: true}
    },
    app_fields: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        key: {type: 'string', maxlength: 50, nullable: false},
        value: {type: 'text', maxlength: 65535, nullable: true},
        type: {type: 'string', maxlength: 50, nullable: false, defaultTo: 'html'},
        app_id: {type: 'string', maxlength: 24, nullable: false, references: 'apps.id'},
        relatable_id: {type: 'string', maxlength: 24, nullable: false},
        relatable_type: {type: 'string', maxlength: 50, nullable: false, defaultTo: 'posts'},
        active: {type: 'bool', nullable: false, defaultTo: true},
        created_at: {type: 'dateTime', nullable: false},
        created_by: {type: 'string', maxlength: 24, nullable: false},
        updated_at: {type: 'dateTime', nullable: true},
        updated_by: {type: 'string', maxlength: 24, nullable: true}
    },
    clients: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        uuid: {type: 'string', maxlength: 36, nullable: false},
        name: {type: 'string', maxlength: 50, nullable: false, unique: true},
        slug: {type: 'string', maxlength: 50, nullable: false, unique: true},
        secret: {type: 'string', maxlength: 191, nullable: false},
        redirection_uri: {type: 'string', maxlength: 2000, nullable: true},
        client_uri: {type: 'string', maxlength: 2000, nullable: true},
        auth_uri: {type: 'string', maxlength: 2000, nullable: true},
        logo: {type: 'string', maxlength: 2000, nullable: true},
        status: {type: 'string', maxlength: 50, nullable: false, defaultTo: 'development'},
        type: {
            type: 'string',
            maxlength: 50,
            nullable: false,
            defaultTo: 'ua',
            validations: {isIn: [['ua', 'web', 'native']]}
        },
        description: {type: 'string', maxlength: 2000, nullable: true},
        created_at: {type: 'dateTime', nullable: false},
        created_by: {type: 'string', maxlength: 24, nullable: false},
        updated_at: {type: 'dateTime', nullable: true},
        updated_by: {type: 'string', maxlength: 24, nullable: true}
    },
    client_trusted_domains: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        client_id: {type: 'string', maxlength: 24, nullable: false, references: 'clients.id'},
        trusted_domain: {type: 'string', maxlength: 2000, nullable: true}
    },
    accesstokens: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        token: {type: 'string', maxlength: 191, nullable: false, unique: true},
        user_id: {type: 'string', maxlength: 24, nullable: false, references: 'users.id'},
        client_id: {type: 'string', maxlength: 24, nullable: false, references: 'clients.id'},
        issued_by: {type: 'string', maxlength: 24, nullable: true},
        expires: {type: 'bigInteger', nullable: false}
    },
    refreshtokens: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        token: {type: 'string', maxlength: 191, nullable: false, unique: true},
        user_id: {type: 'string', maxlength: 24, nullable: false, references: 'users.id'},
        client_id: {type: 'string', maxlength: 24, nullable: false, references: 'clients.id'},
        expires: {type: 'bigInteger', nullable: false}
    },
    subscribers: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        name: {type: 'string', maxlength: 191, nullable: true},
        email: {type: 'string', maxlength: 191, nullable: false, unique: true, validations: {isEmail: true}},
        status: {
            type: 'string',
            maxlength: 50,
            nullable: false,
            defaultTo: 'pending',
            validations: {isIn: [['subscribed', 'pending', 'unsubscribed']]}
        },
        post_id: {type: 'string', maxlength: 24, nullable: true},
        subscribed_url: {type: 'string', maxlength: 2000, nullable: true, validations: {isEmptyOrURL: true}},
        subscribed_referrer: {type: 'string', maxlength: 2000, nullable: true, validations: {isEmptyOrURL: true}},
        unsubscribed_url: {type: 'string', maxlength: 2000, nullable: true, validations: {isEmptyOrURL: true}},
        unsubscribed_at: {type: 'dateTime', nullable: true},
        created_at: {type: 'dateTime', nullable: false},
        created_by: {type: 'string', maxlength: 24, nullable: false},
        updated_at: {type: 'dateTime', nullable: true},
        updated_by: {type: 'string', maxlength: 24, nullable: true}
    },
    invites: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        role_id: {type: 'string', maxlength: 24, nullable: false},
        status: {
            type: 'string',
            maxlength: 50,
            nullable: false,
            defaultTo: 'pending',
            validations: {isIn: [['pending', 'sent']]}
        },
        token: {type: 'string', maxlength: 191, nullable: false, unique: true},
        email: {type: 'string', maxlength: 191, nullable: false, unique: true, validations: {isEmail: true}},
        expires: {type: 'bigInteger', nullable: false},
        created_at: {type: 'dateTime', nullable: false},
        created_by: {type: 'string', maxlength: 24, nullable: false},
        updated_at: {type: 'dateTime', nullable: true},
        updated_by: {type: 'string', maxlength: 24, nullable: true}
    },
    brute: {
        key: {type: 'string', maxlength: 191},
        firstRequest: {type: 'bigInteger'},
        lastRequest: {type: 'bigInteger'},
        lifetime: {type: 'bigInteger'},
        count: {type: 'integer'}
    },
    webhooks: {
        id: {type: 'string', maxlength: 24, nullable: false, primary: true},
        event: {type: 'string', maxlength: 50, nullable: false, validations: {isLowercase: true}},
        target_url: {type: 'string', maxlength: 2000, nullable: false},
        created_at: {type: 'dateTime', nullable: false},
        created_by: {type: 'string', maxlength: 24, nullable: false},
        updated_at: {type: 'dateTime', nullable: true},
        updated_by: {type: 'string', maxlength: 24, nullable: true}
    }
};
