const parsing_rules = {
    placeholder_character: "$",
    delimiter_signature: ["{", "}"],
    delimiter_types: {
        comment: ["#", "#"],
        expression: ["{", "}"],
        statement: ["%", "%"],
    },
    blocks: {
        if: {
            start: "if $0",
            end: "endif",
            intermediates: {
                elif: "elif $-1",
                else: "else"
            },
        },
        for: {
            start: "for $0 in $1",
            end: "endfor",
            intermediates: {}
        },
        macro: {
            start: "macro $0($1)",
            end: "endmacro $0",
            intermediates: {}
        },
    },
}


let a = [
    "abc",
    {
        type: "body_statement",
        blocks: [
            {
                category: "statement",
                content: "break;",
            },
            {
                category: "body_statement",
                type: "if",
                args: ["a > b"],
                blocks: [
                    "Here's some text",
                    {
                        category: "statement",
                        type: "elif",
                        content: "elif a == b",
                    },
                    "some if-else text",
                    {
                        category: "statement",
                        type: "else",
                        content: "else",
                    },
                ]
            }
        ]
    }
]

function find_matching_delimiter(string, start_pos, closing) {
    let i = start_pos
    const current = () => string[i]
    while (i < string.length) {
        if (current() === parsing_rules.delimiter_signature[1]) {
            i -= 1
            if (current() === closing) {
                return i
            }
            i += 1
        }
        i += 1
    }
}

function parse_string(string) {
    let i = 0
    const blocks = [];
    const append_char = (char) => {
        if (blocks.length === 0 || typeof blocks[blocks.length - 1] !== "string") {
            blocks.push(char)
        } else {
            blocks[blocks.length - 1] += char
        }
    }
    const current = () => string[i]
    while (i < string.length) {
        if (current() === parsing_rules.delimiter_signature[0]) {
            i += 1
            const types = parsing_rules.delimiter_types
            let type_detected = false
            for (const type in types) {
                if (current() !== types[type][0]) {
                    continue
                }
                const end = find_matching_delimiter(string, i + 1, type[1])
                const substring = string.substring(
                    i + 1,
                    end
                ).trimStart().trimEnd()
                blocks.push(parse_string(substring))
                i = end + 1
                type_detected = true
                break
            }
            if (!type_detected) {
                i -= 1
                append_char(current())
            }
        } else {

        }
        i += 1
    }
    return blocks
}