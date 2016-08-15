[SLK581 Decoder](https://cmrn.github.io/slk581)
==============
✨ [Decode an SLK!](https://cmrn.github.io/slk581) ✨   
✨ [Create an SLK!](https://cmrn.github.io/slk581/create.html) ✨

What is this?
-------------
This tool attempts to decode SLK581 identifiers by matching the information contained in the SLK with a list of common first and last names.

The most notable use of SLK581 is in the 2016 Australian Census, where it is suspected that the ABS is using SLK581 to match census information against other SLK581 identified datasets (such as health records), as well as to track respondents between multiple censuses.

The goal of this tool is to demonstrate that SLK581 keys should not be considered anonymous information and should not be used in any datasets where the participants did not consent to their personal information (first name, last name, date of birth, and gender) being stored and shared.

How do I use it?
----------------
Simply take an SLK581 and enter it into the tool. The page processes the SLK
in your web browser - no information is sent to a server.

### Sample SLKs ###
Don't have an SLK581 handy? Has the Australian Census 2016 data not leaked yet? [You can create your own SLK here](https://cmrn.github.io/slk581/create.html), or try these sample SLKs to see how easy it is to match an SLK back to a person.

- `URBAL241019541` (Malcolm Turnbull)
- `CCRIC020819641` (Michael McCormack)
- `ORICO130519681` (Scott Morrison)
- `ANOAU270519542` (Pauline Hanson)
- `BBTON041119571` (Tony Abbott)
- `ALSAV111111111` (David Kalisch)
- `OO2AM111111111` ([Cameron Moon](https://twitter.com/cmrn))

✨ [Try it now!](https://cmrn.github.io/slk581) ✨

(Note: people without a public date of birth are given as 11/11/1111)

What's an SLK581?
-----------------
An SLK581, or "Statistical Linkage Key 581", is a 13 character key formulated from a person's name, date of birth, and gender in the format `LLLFFDDMMYYYYG`, where:

- `LLL`: 2nd, 3rd, and 5th characters of the last name
- `FF`: 2nd and 3rd characters of the first name
- `DDMMYYYY`: Date of birth
- `G`: Gender, where 1 is Male, 2 is Female, 3 is Intersex and 9 is not stated. All non-binary responses use the intersex rule (names from both genders). (\*)

The complete definition of the SLK581 format can be found in the [Aristotle Metadata Registry](http://registry.aristotlemetadata.com/item/349510/datasetspecification/statistical-linkage-key-581-cluster).

\* The definition of SLK581 uses a binary definition of gender and does not provide adequate options for transgender and non-binary identities. This is yet another reason why the use of SLK581 should be avoided.

Data
----
The name files in the `src/data/` directory are sourced from the [1990 US Census](http://www.census.gov/topics/population/genealogy/data/1990_census/1990_census_namefiles.html).
