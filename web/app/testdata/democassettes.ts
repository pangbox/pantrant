import { Schema } from "../cassette";

declare var require: any;

const demoCassettes: Array<Schema.Cassette> = [
    {
        Name: 'Test Cassette',
        Time: '',
        Streams: [
            {
                Kind: 'LoginServer',
                CryptoKey: 5,
                HelloMsg: {
                    Time: 0,
                    Data: '',
                    Origin: 'server'
                },
                Messages: [
                    {
                        Time: 1,
                        Data: 'aGVsbG8sIG15IHBhc3N3b3JkIGlzIHBhc3N3b3Jk',
                        Origin: 'client'
                    },
                    {
                        Time: 2,
                        Data: 'YWxyaWdodCBzb3VuZHMgZ29vZC4gaGVyZSdzIHlvdXIgc2Vzc2lvbiB0b2tlbjogMTIzNA==',
                        Origin: 'server'
                    },
                    {
                        Time: 3,
                        Data: 'ayBieWU=',
                        Origin: 'client'
                    },
                    {
                        Time: 4,
                        Data: 'YWxyaWdodCB5b3VyZSBhbGwgc2V0LiByZW1lbWJlciwgeW91IGNhbiBoYXZlIGEgZ3JlYXQgZGF5IGlmIHlvdSBtYWtlIGl0IGEgZ3JlYXQgZGF5LiBnb29kYnll',
                        Origin: 'server'
                    }
                ],
            },
            {
                Kind: 'GameServer',
                CryptoKey: 9,
                HelloMsg: {
                    Time: 5,
                    Data: '',
                    Origin: 'server'
                },
                Messages: [
                    {
                        Time: 6,
                        Data: 'aGV5LCBpIGhhdmUgYSB0b2tlbi4gaXRzIDEyMzQ=',
                        Origin: 'client'
                    },
                    {
                        Time: 7,
                        Data: 'Y29vbC4gaGFuZyBvbg==',
                        Origin: 'server'
                    },
                    {
                        Time: 8,
                        Data: 'b2theSBjb29sLiB5b3VyIG5pY2tuYW1lIGlzIGpvaG4gbm93LiB5b3UgYXJlIGlkIDEyMzQ1Njc4OS4gaGVyZSdzIGEgY3JhcGxvYWQgb2YgZGF0YSBpbiBhIHNjaGVtYSBjb2JibGVkIHRvZ2V0aGVyIGJ5IHVuZGVycGFpZCBudHJlZXYgZW1wbG95ZWVzIG92ZXIgeWVhcnMsIGFnb25pemluZ2x5IHBhcnRpdGlvbmVkIGludG8gdmFyaW91cyBzZWdtZW50cyBpbiBjb21wbGV0ZWx5IGRpZmZlcmVudCBmb3JtYXRzLiB0aGlzIGdhbWUncyBlbmdpbmUgaXMgYmFzZWQgb24gaGFsZiBsaWZlIGZvciBjaHJpc3QncyBzYWtlLCB3aHkgd291bGQgeW91IGF0dGVtcHQgdG8gcmV2ZXJzZSBlbmdpbmVlciB0aGlz',
                        Origin: 'server'
                    },
                    {
                        Time: 9,
                        Data: 'd29haCBoYW5nIG9uLiBsZXQgbWUgYWNjZXB0IGFsbCB0aGlzIGRhdGEgaW50byBmaXhlZC1zaXplIGJ1ZmZlcnMgd2l0aG91dCBjaGVja2luZyB0byBzZWUgaWYgaXQgZml0cy4gYWxyaWdodCBpdCBkb2VzLiBjb29sLCBpJ20gZ29pbmcgdG8gZG8gYSBzZXF1ZW5jZSBvZiBoYXJkY29kZWQgdGhpbmdzIG5vdy4=',
                        Origin: 'client'
                    },
                    {
                        Time: 11,
                        Data: 'YWxyaWdodC4gY2FuIGkgam9pbiB0aGUgLi4uIHNlcnZlcj8gcmVhbG0/IGkgbWVhbiB5b3UncmUgdGhlIHNlcnZlciBidXQgdGhpcyBpcyBhIHNlcnZlciBsaXN0IHNvIGkgZ3Vlc3MgdGhvc2UgdGhpbmdzIGFyZSBzZXJ2ZXJzIHRvby4gYW55d2F5IHllYWggY2FuIGkgam9pbiBvbmUgb2YgdGhlbQ==',
                        Origin: 'client'
                    },
                    {
                        Time: 12,
                        Data: 'c3VyZSBraWQgeW91cmUgaW4=',
                        Origin: 'server'
                    },
                    {
                        Time: 16,
                        Data: 'ZG8gaSBoYXZlIG1haWw=',
                        Origin: 'client'
                    },
                    {
                        Time: 16.2,
                        Data: 'eWVh',
                        Origin: 'server'
                    },
                    {
                        Time: 16.4,
                        Data: 'U2V2ZW4gV2VpcmQgVHJpY2tzIFRvIGEgQmV0dGVyIEJvZHkgKCM3IGlzIElsbGVnYWwgaW4gTW9zdCBTdGF0ZXMp',
                        Origin: 'server'
                    },
                    {
                        Time: 16.5,
                        Data: 'U29tZWJvZHkgTWFzaGVkIFVwIFRoZSAiRmxpbnRzdG9uZXMiIFRoZW1lIFdpdGggVW5kZXJ0YWxlIE11c2ljIGFuZCBpdCBpcyBFdmVyeXRoaW5n',
                        Origin: 'server'
                    },
                    {
                        Time: 16.6,
                        Data: 'WW91IFdpbGwgTmV2ZXIgQmVsaWV2ZSBUaGVzZSAxMCBJbWFnZXMgQXJlIFJlYWQgKCMzIENhdXNlcyBJbnN0YW50IENhcmRpYWMgQXJyZXN0KQ==',
                        Origin: 'server'
                    },
                    {
                        Time: 16.7,
                        Data: 'Q2FsbGluZyBpdCBRdWl0czogVGhpcyBNYW4gR2l2ZXMgVXAgVHJ5aW5nIFRvIENvbWUgVXAgd2l0aCBTaWxseSBDbGlja2JhaXQgSGVhZGxpbmVz',
                        Origin: 'server'
                    },
                    {
                        Time: 16.8,
                        Data: 'UGhldy4gQWxyaWdodC4gVGhhdCB3YXMgZXZlcnl0aGluZy4=',
                        Origin: 'server'
                    },
                    {
                        Time: 19,
                        Data: 'eW91IGtub3cgdGhpcyBpcyBiYXNpY2FsbHkganVzdCByb2xlIHBsYXlpbmcgYSBjbGllbnQgc2VydmVyIGFyY2hpdGVjdHVyZQ==',
                        Origin: 'client'
                    },
                    {
                        Time: 20,
                        Data: 'aSB0cnkgbm90IHRvIHRoaW5rIGFib3V0IGl0LiBhbGNvaG9sIGhlbHBz',
                        Origin: 'server'
                    },
                    {
                        Time: 21,
                        Data: 'QWxsIG9mIHRoaXMgc2Vuc2VsZXNzIGJhbnRlciBtYWtlcyBtZSBodW5ncnkuIEknbSBnb2luZyB0byBUYWNvIEJlbGwuIExhdGVyLCBHYW1lU2VydmVyLg==',
                        Origin: 'client'
                    },
                    {
                        Time: 22,
                        Data: 'YWxyaWdodC4gaSdtIGdvaW5nIHRvIGdvIGNyYXNoIGZvciBubyByZWFzb24gaW4gYSBiaXQgc28gdGhhdCdzIHByb2JhYmx5IG5vdCBhIGJhZCBpZGVhLiBsYXRlcg==',
                        Origin: 'server'
                    },
                ],
            },
            {
                Kind: 'MessageServer',
                CryptoKey: 5,
                HelloMsg: {
                    Time: 6,
                    Data: '',
                    Origin: 'server'
                },
                Messages: [
                    {
                        Time: 6.8,
                        Data: 'aW0gMTIzNCBhbmQgaW0gcmVhZHkgdG8gY2hhdA==',
                        Origin: 'client'
                    },
                    {
                        Time: 8.1,
                        Data: 'ay4gbm9ib2R5IGlzIG9ubGluZSB0aG91Z2gu',
                        Origin: 'server'
                    },
                    {
                        Time: 12,
                        Data: 'YWggYnVtbWVyLg==',
                        Origin: 'client'
                    },
                ],
            },
        ],
        VideoURL: require('url:./video.mp4'),
    },
];

export default demoCassettes;
