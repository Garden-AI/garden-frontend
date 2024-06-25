import React, { useState } from "react";

const UserProfileInfo = () => {
    const initialInfoState = {
        id: null,
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        affiliations: '',
        domains: '',
        skills: ''
    }
    const [info, setInfo] = useState(initialInfoState);
    const [edit, setEdit] = useState(false);

    const handleEdit = () => {
        setEdit(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        //saveInfo();
        setEdit(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInfo({ ...info, [name]: value });
    };

    /*
    const saveInfo = () => {
        const data = {
        email: info.email,
        firstname: info.firstname,
        lastname: info.lastname,
        phone: info.phone,
        affiliations: info.affiliations,
        domains: info.domains,
        skills: info.skills
        };

        if (info.id === null) {
        // send post request to backend api with the data object containing user profile info 
        InfoDataService.create(data)
            .then((response) => {
            console.log('create', response.data);
            setInfo({
                ...response.data
            });
            })
            .catch((e) => {
            console.error(e);
            });
        } else {
        // send
        InfoDataService.update(info.id, data)
            .then((response) => {
            console.log(response);
            setInfo({
                ...response.data
            });
            console.log(response.data);
            })
            .catch((e) => {
            console.error(e);
            });
        }
    };
    */

  return ( 
    <div className="p-20 w-full">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col space-y-6 flex-grow">
          <p className="text-gray-600">First Name:</p>
          <p className="text-gray-600">Phone Number:</p>
          <p className="text-gray-600">Institutions/Affiliations:</p>
          <p className="text-gray-600">Domain(s):</p>
        </div>
        <div className="w-20"></div>
        <div className="flex flex-col space-y-6 flex-grow">
          <p className="text-gray-600">Last Name:</p>
          <p className="text-gray-600">Email Address:</p>
          <p className="text-gray-600">Skills:</p>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col space-y-6 flex-grow">
          {edit ? (
            <>
              <input
                type="text"
                name="firstname"
                value={info.firstname}
                onChange={handleInputChange}
                placeholder="First Name"
              />
              <input
                type="text"
                name="phone"
                value={info.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
              />
              <input
                type="text"
                name="affiliations"
                value={info.affiliations}
                onChange={handleInputChange}
                placeholder="Institutions/Affiliations"
              />
              <input
                type="text"
                name="domains"
                value={info.domains}
                onChange={handleInputChange}
                placeholder="Domain(s)"
              />
            </>
          ) : (
            <>
              <p>{info.firstname}</p>
              <p>{info.phone}</p>
              <p>{info.affiliations}</p>
              <p>{info.domains}</p>
            </>
          )}
        </div>
        <div className="w-20"></div>
        <div className="flex flex-col space-y-6 flex-grow">
          {edit ? (
            <>
              <input
                type="text"
                name="lastname"
                value={info.lastname}
                onChange={handleInputChange}
                placeholder="Last Name"
              />
              <input
                type="email"
                name="email"
                value={info.email}
                onChange={handleInputChange}
                placeholder="Email Address"
              />
              <input
                type="text"
                name="skills"
                value={info.skills}
                onChange={handleInputChange}
                placeholder="Skills"
              />
            </>
          ) : (
            <>
              <p>{info.lastname}</p>
              <p>{info.email}</p>
              <p>{info.skills}</p>
            </>
          )}
        </div>
      </div>
      <hr className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50 my-10 mx-auto w-full" />
      <div className="flex justify-end">
        {edit ? (
          <button onClick={handleSave} className="flex flex-row items-center gap-2 rounded-lg border border-gray-200 px-2 py-1 text-sm">Save</button>
        ) : (
          <button onClick={handleEdit} className="flex flex-row items-center gap-2 rounded-lg border border-gray-200 px-2 py-1 text-sm">Edit Profile</button>
        )}
      </div>
    </div>
  );
};

export default UserProfileInfo;
